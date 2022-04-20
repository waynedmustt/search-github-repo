import React, { useEffect, useRef, useState } from 'react'
import {
    searchRepo
} from '../../apis';
import Table from '../../components/table'
import {
 querySearch
} from '../../interfaces/table'

const Main: any = () => {
    const inputSearchRef = useRef<any>(null)
    const [tableData, setTableData] = useState<Object>({})
    const [keyword, setKeyword] = useState<string>('')
    const [selectedKeyword, setSelectedKeyword] = useState<string>('')
    const [keywordResult, setKeywordResult] = useState<Array<Object>>([])
    const [showKeywordResult, setshowKeywordResult] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoadingKeyword, setIsLoadingKeyword] = useState<boolean>(false)
    const [page, setPage] = useState<Number>(1)

    async function initSearch(page: Number, selectedKeyword: string) {
        let result = null

        let options: querySearch = {}
        options.page = page
        try {
            setIsLoading(true)
            result = await searchRepo(selectedKeyword, 'name', options)
        } catch (e) {
            setIsLoading(false)
            setError('error when fetching data!')
        }

        if (result?.status !== 200) {
            setIsLoadingKeyword(false)
            setError(result?.data?.message)
            return
        }
        setIsLoading(false)
        setTableData(result?.data)
    }

    useEffect(() => {
        if (keyword === '') {
            setshowKeywordResult(false)
            return
        }
        let throttle: any = null
        async function initKeywordResult() {
            throttle = setTimeout(searchKeyword, 500)
        }

        initKeywordResult()
        return () => {
            clearTimeout(throttle)
        }
        /* eslint-disable */
    }, [keyword])

    const searchKeyword = async () => {
        if (keyword === '') {
            return
        }
        let result = null

        let options: querySearch = {}
        options.perPage = 10
        try {
            setIsLoadingKeyword(true)
            result = await searchRepo(keyword, 'name', options)
        } catch (e) {
            setIsLoadingKeyword(false)
            setError('error when fetching data!')
        }

        if (result?.status !== 200) {
            setIsLoadingKeyword(false)
            setError(result?.data?.message)
            return
        }
        result = result?.data?.items.map((res: any) => {
            return {
                name: res?.name
            }
        })
        setIsLoadingKeyword(false)
        setshowKeywordResult(true)
        setKeywordResult(result)
    }

    const triggerKeyword = (e: any) => {
        setshowKeywordResult(false)
        setKeyword(e.target.value)
    }

    const triggerSearch = (selectedKeyword: string) => {
        inputSearchRef.current.value = selectedKeyword
        setSelectedKeyword(selectedKeyword)
        setshowKeywordResult(false)
        setPage(1)
        initSearch(1, selectedKeyword)
    }

    const showData = () => {
        return (
            <React.Fragment>
                {isLoading ? <span className='search-label text-center loading mt-s'>{'Loading ...'}</span> : 
                <Table 
                data={tableData}
                choosePage={choosePage}
                page={page}
                />} 
            </React.Fragment>
        )
    }

    const choosePage = (page: Number) => {
        setPage(page)
        setshowKeywordResult(false)
        initSearch(page, selectedKeyword)
    }

    const mapKeywordResult = (keywordResult: Array<Object>) => {
        return (
            <div className='match-keyword'>
                {keywordResult?.map((res: any, idx: any) => (
                    <span key={idx} className='search-label mb-s' onClick={(e) => {
                        e.preventDefault()
                        triggerSearch(res?.name)
                    }}>{res?.name}</span>
                ))}
            </div>
        )
    }

    return (
        <React.Fragment>
            <div className="container">
                    <div className="header mt-m">
                        <input type="text" className="search-btn" name="search-box" placeholder="Search repository.." 
                        disabled={isLoading}
                        onKeyUp={triggerKeyword}
                        onFocus={() => setshowKeywordResult(true)}
                        ref={inputSearchRef}
                        autoComplete='off'
                        />
                        {isLoadingKeyword && <span className='search-label text-center mt-s'>{'Loading ...'}</span>}
                        {keywordResult?.length > 0 && showKeywordResult && mapKeywordResult(keywordResult)}
                    </div>
                    <div className="mt-m">
                        {error ? <h3 className='error'>{error}</h3> : 
                            showData()
                        }
                    </div>
            </div>
        </React.Fragment>
    )
}

export default Main