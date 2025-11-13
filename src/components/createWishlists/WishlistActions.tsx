import styles from "../../pages/WishlistView/WishlistView.module.scss";
import Button from "../UI/buttons/Button";
import { Share2, Plus, Trash2 } from "lucide-react";
import React from "react";
import useMedia from "use-media";

interface WishlistActionsProps {
  onAddWish: () => void;
  onDeleteMode: () => void;
}

const WishlistActions: React.FC<WishlistActionsProps> = ({
  onAddWish,
  onDeleteMode,
}) => {
  const isMobile = useMedia({ maxWidth: "730px" });

  return (
    <div className={styles.actions}>
      <Button icon={<Plus size={18} />} onClick={onAddWish}>
        {!isMobile && "Добавить желание"}
      </Button>
      <Button icon={<Trash2 size={18} />} onClick={onDeleteMode}>
        {!isMobile && "Удалить желание"}
      </Button>
      <Button icon={<Share2 size={18} />}>{!isMobile && "Поделиться"}</Button>
    </div>
  );
};

export default WishlistActions;
