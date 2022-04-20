const searchRepo = async (q: String, type: String, options: any) => {

    let url = `https://api.github.com/search/repositories?q=${q}+in:${type}`
    if (options?.page) {
        url += `&page=${options?.page}`
    }
    if (options?.perPage) {
        url += `&per_page=${options?.perPage}`
    }

    let status = 0
    return fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3.text-match+json',
            'Content-Type': 'application/json'
        }
    })
    .then((response: any) => {
        status = response?.status
        return response?.json()
    })
    .then((data: any) => {
        return {
            status: status,
            data: data
        }
    })
    .catch((error: any) => {
        return error
    })
}

export {
    searchRepo
}