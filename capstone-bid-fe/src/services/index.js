import { products } from "../components/data"


const service = {
    getData: ({ from, to }) => {
        return new Promise((resolve, reject) => {

            const Data = products.slice(from, to);

            resolve({
                count: products.length,
                data: Data
            })
        });
    }
}
export default service;