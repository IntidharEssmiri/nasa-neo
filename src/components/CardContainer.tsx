
import React from 'react';
import Card from './Card';
import NEOChart from './NEOChart';

const CardContainer: React.FC = () => {
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      <Card>
        <NEOChart />
      </Card>
      <Card>
        <h2>Card 2</h2>
        <p>Content for the second card.</p>
      </Card>
      <Card>
        <h2>Card 3</h2>
        <p>Content for the third card.</p>
      </Card>
      <Card>
        <h2>Card 4</h2>
        <p>Content for the fourth card.</p>
      </Card>
    </div>
  );
}

export default CardContainer;
