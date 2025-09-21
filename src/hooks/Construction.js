import { useRouter } from "vue-router"
export default function(){
    const router = useRouter();
    function routeChange(patientId,code) {
        //路由跳转带参数
        // console.log('useFile---'+userId)
        router.push({
          path: '/Operation',
          query: {
            patientId:patientId,
            info:code
          },
        });
   }
   return routeChange
}