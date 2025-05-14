class ApiClient{
    constructor()
    {
        this.baseURL="http://localhost:8000/api/v1/"
        this.defaultHeaders={
            'Content-Type':'application/json',
            'Accept':'application/json'
        }
    }
    async customFetch(endpoint,options={}){
    try {
        const url=`${this.baseURL}${endpoint}`
        const headers={...this.defaultHeaders,...options.headers}
        const config={
            ...options,
            headers,
            credentials:'include'
        }
       const response= await fetch(url,config)

       const data=await response.json()
       return data
    } catch (error) {
        console.error("API ERROR",error)
        throw error
    }
    }
    //AUTH ENDPOINTS
    async signup(name,email,password){
     return  this.customFetch('users/register',{method:"POST",body:JSON.stringify({name,email,password})})   
    }
    async login(email,password){
        console.log("calling login");
       return this.customFetch('users/login',{method:"POST",body:JSON.stringify({email,password})})   
      }
      async logout(){
       return  this.customFetch('users/logout',{method:"POST",body:JSON.stringify()})   
      }
      async getUser(){
       return  this.customFetch('users/me',{method:"GET",body:JSON.stringify()})   
      }
}
const apiClient=new ApiClient()
export default apiClient