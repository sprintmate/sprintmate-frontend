import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatisticsPieChart from './StatisticsPieChart';

const StatisticsCard = ({ statistics }) => {
  if (!statistics) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <StatisticsPieChart statistics={statistics} />
      </CardContent>
    </Card>
  );
};

export default StatisticsCard; 