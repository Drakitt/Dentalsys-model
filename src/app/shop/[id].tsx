import { NextPage, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';





const Customer: NextPage= () => {
  const router = useRouter();
  console.log(router)

    return <h1>Cuss</h1>
};

export default Customer;