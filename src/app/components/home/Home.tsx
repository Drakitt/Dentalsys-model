

 


import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter()
  const { id } = router.query

  return <p>User: {id}</p>
}

export default Home