import { NextPage } from 'next';
import { useRouter } from 'next/router';

const TestPage: NextPage = () => {
  const { query } = useRouter();

  return (
    <div>{JSON.stringify(query)}</div>
  );
};

export default TestPage;
