import { NextPage, GetStaticProps, InferGetStaticPropsType } from 'next';

import { App as Canvas } from '../../Canvas.js'



export default function Details({params,}:{
    params:{shopId:any};
}){
    return(
        <Canvas shopId={params.shopId}/>
    )
}