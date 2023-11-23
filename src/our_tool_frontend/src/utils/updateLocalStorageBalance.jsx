export const updateLocalStorageBalance = async (balance) => {
    try {
        let tokenData = JSON.parse(localStorage.getItem("selectToken"));
        if(!tokenData){
            return false;
        }
        tokenData.balance = balance;
        localStorage.setItem("selectToken",JSON.stringify(tokenData));
    } catch (error) {
        console.log(error);
        return false;
    }
}