import styles from "../WishlistContent/WishlistContent.module.scss";
import Button from "../UI/buttons/Button";
import { Share2, Plus, Trash2, PencilLine } from "lucide-react";
import React from "react";
import useMedia from "use-media";

interface WishlistActionsProps {
  onAddWish: () => void;
  onDeleteMode: () => void;
  onEditWish?: () => void;
  canEdit?: boolean;
  onDeleteList?: () => void;
}

const WishlistActions: React.FC<WishlistActionsProps> = React.memo(({ 
  onAddWish,
  onDeleteMode,
  onEditWish,
  canEdit,
}) => {
  const isMobile = useMedia({ maxWidth: "730px" });

  return (
    <div className={styles.actions}>
      <Button icon={<Plus size={18} />} onClick={onAddWish}>
        {!isMobile && "Добавить"}
      </Button>
      <Button
          icon={<PencilLine size={18}/>} 
        onClick={onEditWish}
        disabled={canEdit === false}
      >
        {!isMobile && "Редактировать"}
      </Button>
      <Button icon={<Trash2 size={18} />} onClick={onDeleteMode}>
        {!isMobile && "Удалить"}
      </Button>
      <Button icon={<Share2 size={18} />}>{!isMobile && "Поделиться"}</Button>
    </div>
  );
});

WishlistActions.displayName = 'WishlistActions';

export default WishlistActions;
