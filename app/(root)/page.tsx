import { Heatmap } from '@/components/charts/Heatmap';
import { MarketData } from '@/components/charts/MarketData';
import { MarketOverview } from '@/components/charts/MarketOverview';
import { TopStories } from '@/components/charts/TopStories';
import { testDbConnection } from '@/lib/actions/test.actions';

const Home = async () => {
  await testDbConnection();
  
  return (
    <div className='flex min-h-screen home-wrapper'>
      <section className='grid w-full gap-8 home-section'>
        <div className='md:col-span-1 xl:col-span-1'>
          <MarketOverview />
        </div>
        <div className='md:col-span-1 xl:col-span-2'>
          <Heatmap />
        </div>
      </section>
      <section className='grid w-full gap-8 home-section'>
        <div className='h-full md:col-span-1 xl:col-span-1'>
          <TopStories />
        </div>
        <div className='h-full md:col-span-1 xl:col-span-2'>
          <MarketData />
        </div>
      </section>
    </div>
  );
};

export default Home;
