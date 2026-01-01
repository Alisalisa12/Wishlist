import UserModel from "../models/User.js";
import WishlistModel from "../models/Wishlist.js";

// Поиск среди друзей
export const searchFriends = async (req, res) => {
  try {
    const query = req.query.q;

    const user = await UserModel.findById(req.userId).populate({
      path: "friends",
      match: {
        username: { $regex: query, $options: "i" },
      },
      select: "_id username fullName avatarUrl",
    });

    res.json(user.friends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось выполнить поиск среди друзей" });
  }
};

// Поиск среди всех пользователей 
export const searchAllUsers = async (req, res) => {
  try {
    const query = req.query.q;
    const currentUser = await UserModel.findById(req.userId);

    const users = await UserModel.find({
      username: { $regex: query, $options: "i" },
      _id: {
        $ne: req.userId,
        $nin: currentUser.friends,
      },
    }).select("_id username fullName avatarUrl");

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось выполнить поиск" });
  }
};

// Добавление друга
export const addFriend = async (req, res) => {
  try {
    const userId = req.userId;
    const friendId = req.params.friendId;

    if (userId === friendId) {
      return res.status(400).json({ message: "Нельзя добавить себя" });
    }

    const user = await UserModel.findById(userId);
    const friend = await UserModel.findById(friendId);

    if (!friend)
      return res.status(404).json({ message: "Пользователь не найден" });

    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Пользователь уже в друзьях" });
    }

    user.friends.push(friendId);
    await user.save();

    res.json({ success: true, message: "Друг добавлен" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось добавить друга" });
  }
};
// Получение списка друзей текущего пользователя
export const getFriendsList = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).populate({
      path: "friends",
      select: "_id username fullName avatarUrl",
    });

    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });

    res.json({ friends: user.friends });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось получить список друзей" });
  }
};

// Удаление друга
export const removeFriend = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    const friendId = req.params.friendId;

    if (!user.friends.includes(friendId)) {
      return res
        .status(404)
        .json({ message: "Пользователь не найден в друзьях" });
    }

    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    await user.save();

    res.json({ success: true, message: "Друг удалён" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось удалить друга" });
  }
};

// Просмотр профиля друга
export const getFriendProfile = async (req, res) => {
  try {
    const friendId = req.params.friendId;
    const linkToken = req.query.token; // для ссылочных вишлистов

    const friend = await UserModel.findById(friendId).select("_id username fullName avatarUrl friends");
    if (!friend) return res.status(404).json({ message: "Пользователь не найден" });

    const currentUser = await UserModel.findById(req.userId);
    const isFriend = currentUser.friends.includes(friendId);
    const isOwner = req.userId === friendId;

    const allWishlists = await WishlistModel.find({ user: friendId });

    const visibleWishlists = allWishlists.filter(w => {
      if (w.visibility === "public") return true;
      if (w.visibility === "friends" && isFriend) return true;
      if (w.visibility === "private" && isOwner) return true;
      if (w.visibility === "link" && linkToken === w.linkToken) return true;
      return false;
    });

    res.json({ friend, wishlists: visibleWishlists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось получить профиль друга" });
  }
};