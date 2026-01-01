import UserModel from "../models/User.js";
import WishlistModel from "../models/Wishlist.js";

// Поиск среди друзей
export const searchFriends = async (req, res) => {
  try {
    const query = req.query.q || "";
    const user = await UserModel.findById(req.userId).populate({
      path: "friends",
      match: { username: { $regex: query, $options: "i" } },
      select: "_id username fullName avatarUrl",
    });

    res.json(user.friends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось выполнить поиск среди друзей" });
  }
};

// Поиск среди всех пользователей
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q || "";
    const currentUser = await UserModel.findById(req.userId);

    const users = await UserModel.find({
      username: { $regex: query, $options: "i" },
      _id: { $ne: req.userId, $nin: currentUser.friends },
    }).select("_id username fullName avatarUrl friendRequests");

    const results = users.map(u => ({
      _id: u._id,
      username: u.username,
      fullName: u.fullName,
      avatarUrl: u.avatarUrl,
      hasSentRequest: u.friendRequests.includes(req.userId),
      incomingRequest: currentUser.friendRequests.includes(u._id),
    }));

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось выполнить поиск" });
  }
};

export const getIncomingFriendRequests = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)
      .populate({
        path: "friendRequests",
        select: "_id username fullName avatarUrl",
      });

    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    res.json({ incomingRequests: user.friendRequests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось получить входящие заявки" });
  }
};

// Отправка запроса в друзья
export const sendFriendRequest = async (req, res) => {
  try {
    const friendId = req.params.friendId;
    const userId = req.userId;

    if (userId === friendId) return res.status(400).json({ message: "Нельзя добавить себя" });

    const friend = await UserModel.findById(friendId);
    if (!friend) return res.status(404).json({ message: "Пользователь не найден" });

    if (friend.friends.includes(userId)) return res.status(400).json({ message: "Пользователь уже в друзьях" });
    if (friend.friendRequests.includes(userId)) return res.status(400).json({ message: "Запрос уже отправлен" });

    friend.friendRequests.push(userId);
    await friend.save();

    res.json({ success: true, message: "Запрос отправлен" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка при отправке запроса" });
  }
};

// Принятие запроса
export const acceptFriendRequest = async (req, res) => {
  try {
    const requesterId = req.params.friendId;
    const user = await UserModel.findById(req.userId);
    const requester = await UserModel.findById(requesterId);

    if (!user || !requester) return res.status(404).json({ message: "Пользователь не найден" });

    const hasRequest = user.friendRequests.includes(requesterId);

    if (!hasRequest) {
      return res.json({ success: false, message: "Запрос уже обработан" });
    }

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);
    user.friends.push(requesterId);
    requester.friends.push(req.userId);

    await user.save();
    await requester.save();

    res.json({ success: true, message: "Запрос принят" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка при принятии запроса" });
  }
};

// Отклонение запроса
export const declineFriendRequest = async (req, res) => {
  try {
    const requesterId = req.params.friendId;
    const user = await UserModel.findById(req.userId);

    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    const hadRequest = user.friendRequests.includes(requesterId);

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requesterId);
    await user.save();

    if (!hadRequest) {
      return res.json({ success: false, message: "Запрос уже обработан" });
    }

    res.json({ success: true, message: "Запрос отклонен" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка при отклонении запроса" });
  }
};

// Получение списка друзей
export const getFriendsList = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).populate({
      path: "friends",
      select: "_id username fullName avatarUrl",
    });

    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    res.json({ friends: user.friends });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось получить список друзей" });
  }
};

// Удаление друга (обоюдно)
export const removeFriend = async (req, res) => {
  try {
    const userId = req.userId;
    const friendId = req.params.friendId;

    const user = await UserModel.findById(userId);
    const friend = await UserModel.findById(friendId);

    if (!user.friends.includes(friendId)) return res.status(404).json({ message: "Пользователь не найден в друзьях" });

    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId);

    await user.save();
    await friend.save();

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
    const linkToken = req.query.token;

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
