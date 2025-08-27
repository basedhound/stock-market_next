import { testDbConnection } from "@/lib/actions/test.actions";

const Home = async () => {
  const response = await testDbConnection();
  return (
    <div className="flex min-h-screen home-wrapper">
      <p>{response.data} to database</p>
      <section className="w-full gap-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <div className="md:col-span-1 xl:col-span-1">MarketSummary</div>
        <div className="md:col-span-1 xl:col-span-2">Heatmap</div>
      </section>
      <section className="w-full gap-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <div className="h-full md:col-span-1 xl:col-span-1">TopStories</div>
        <div className="h-full md:col-span-1 xl:col-span-2">
          Market Performance
        </div>
      </section>
    </div>
  );
};

export default Home;
