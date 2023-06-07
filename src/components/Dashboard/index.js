import React from 'react'
import Layout from '../Layout'

const Dashboard = () => {
  return (
    <Layout>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <p>this is content one: Dashboard</p>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <p>this is content two Dashboard</p>
      </div>
    </Layout>
  );
};

export default Dashboard;
