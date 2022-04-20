import React, { useEffect, useState } from 'react';
import './pagination.css'

const Pagination = (props: any) => {
    const {
        choosePage,
        totalCount,
        setTotalCount,
        page 
    } = props
    const [paginationList, setPaginationList] = useState<any>([])
    
    useEffect(() => {
        if (totalCount === 0) {
            return
        }
        let result = []
        let paginationLength = 7
        let lastandFirstLength = 5
        let last5TotalCount = []

        if (totalCount <= 5) {
            for (let i = 1; i <= totalCount; i += 1) {
                result.push(i)
            }
            setPaginationList(result)
            return
        }

        for (let j = 4; j >= 0; j -= 1) {
            last5TotalCount.push(totalCount - j)
        }
        // default pagination
        for (let i = 1; i <= paginationLength; i += 1) {
            if (i === paginationLength - 1) {
                result.push('...')
                continue
            }
            if (i === paginationLength) {
                result.push(totalCount)
                continue
            }
            result.push(i)
        }
        if ((page >= lastandFirstLength && last5TotalCount.indexOf(page) === -1)
            || page === last5TotalCount[0]) {
            result[1] = '...'
            result[2] = page - 1
            result[3] = page
            result[4] = page + 1
        }

        if (last5TotalCount.indexOf(page) !== -1 && page !== last5TotalCount[0]) {
            result = []
            for (let k = last5TotalCount.length - 1; k >= 0; k -= 1) {                
                result[k] = last5TotalCount[k]
            }
            result.unshift("...")
            result.unshift(1) 
        }

        setPaginationList(result)
    }, [page, totalCount])

    const triggerPage = (pagination: Number) => {
        if (pagination === page) {
            return
        }
        choosePage(pagination)
        setTotalCount(0)
    }

    const triggerNextPage = (e: any) => {
        e.preventDefault()
        if (page === totalCount) {
            return
        }

        choosePage(page + 1)
    }

    const triggerPrevPage = (e: any) => {
        e.preventDefault()
        if (page === 1) {
            return
        }
        choosePage(page - 1)
    }

    return (
        <React.Fragment>
            {paginationList?.length === 0 ? null :
                <ul>
                    <li>
                        <a 
                        className={`${page === 1 ? 'prev disabled': ''}`}
                        href=' ' onClick={triggerPrevPage}>{'<'}
                        </a>
                    </li>
                    {paginationList?.map((pagination: any, i: any) => (
                        <li key={i}>{pagination === "..." ? pagination : 
                            <a href=' ' 
                            className={`${pagination === page ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault()
                                triggerPage(pagination)
                            }}>{pagination}</a>
                            }
                        </li>           
                    ))}
                    <li>
                        <a 
                        className={`${page === totalCount ? 'next disabled': ''}`}
                        href=' ' onClick={triggerNextPage}>{'>'}
                        </a>
                    </li>
                </ul>
            }
        </React.Fragment>
    );
}

export default Pagination