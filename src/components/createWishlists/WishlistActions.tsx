import useMedia from "use-media";
import styles from "../../pages/WishlistView/WishlistView.module.scss";
import Button from "../UI/buttons/Button";
import { Share2, Plus, Trash2 } from "lucide-react";
import React from "react";


const WishlistActions = () => {
  const isMobile = useMedia({ maxWidth: "730px" });
  return (
    <div className={styles.actions}>
      <Button icon={<Plus size={18} />}>
        {!isMobile && " Добавить желание"}
      </Button>
      <Button icon={<Trash2 size={18} />}>
        {!isMobile && " Удалить желание"}
      </Button>
      <Button icon={<Share2 size={18} />}>
        {!isMobile && " Поделиться"}
      </Button>
    </div>
  );
};

export default WishlistActions;