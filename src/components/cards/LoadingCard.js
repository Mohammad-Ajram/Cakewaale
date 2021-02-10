import { Card, Skeleton } from "antd";

const LoadingCard = ({ count, classValue }) => {
  const cards = () => {
    let totalCards = [];
    for (let i = 0; i < count; i++) {
      totalCards.push(
        <div className={classValue} key={i}>
          <Card className="mb-3 mr-2">
            <Skeleton active></Skeleton>
          </Card>
        </div>
      );
    }
    return totalCards;
  };
  return cards();
};

export default LoadingCard;
