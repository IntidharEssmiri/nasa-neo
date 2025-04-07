
import React from 'react';
import Card from './Card';
import NEOChart from './NEOChart';
import NEOTable from './NEOTable'; 
import NEOHighChart from './NEOHighChart';
import NEOTable2 from './NEOTable2';

const CardContainer: React.FC = () => {
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      <Card>
        <NEOChart />
      </Card>
      <Card>
        <NEOTable />
      </Card>
      <Card>
        <NEOHighChart />
      </Card>
      <Card>
        <NEOTable2 />
      </Card>
    </div>
  );
}

export default CardContainer;
