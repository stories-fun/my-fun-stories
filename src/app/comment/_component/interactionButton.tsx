// InteractionButtons.tsx
import Image from "next/image";

const InteractionButtons = ({ comment, onReplyClick }: any) => {
  //   const [likes, setLikes] = useState(comment.likes || 0);
  //   const [dislikes, setDislikes] = useState(0);

  //   const handleLike = () => {
  //     setLikes(likes + 1);
  //   };

  //   const handleDislike = () => {
  //     setDislikes(dislikes + 1);
  //   };

  return (
    <div className="flex items-center gap-4">
      <div className="flex cursor-pointer items-center gap-2">
        <button aria-label="Like">
          {/* <CiThumbUp className="text-gray-500 hover:text-gray-700" /> */}
          <Image src={"/images/flower.png"} width={15} height={15} alt="" />
        </button>
        <span className="text-xs text-gray-500">likes</span>
      </div>

      <div className="flex cursor-pointer items-center gap-2">
        <button aria-label="Dislike">
          {/* <CiThumbDown className="text-gray-500 hover:text-gray-700" /> */}
          <Image src={"/images/dislike.png"} width={15} height={15} alt="" />
        </button>
        <span className="text-xs text-gray-500">dislikes</span>
      </div>

      {/* <button
        className="text-xs text-gray-500 hover:text-gray-700"
        onClick={onReplyClick}
      >
        Reply
      </button> */}
    </div>
  );
};

export default InteractionButtons;
