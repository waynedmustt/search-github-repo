import React, { useEffect, useState } from 'react';
import Pagination from '../pagination';

const Table = (props: any) => {
    const {
        data,
        choosePage,
        page,
    } = props
    const [totalCount, setTotalCount] = useState<number>(0)
    const [items, setItems] = useState<Array<any>>([])

    useEffect(() => {
        if (!data) {
            return
        }

        setItems(data?.items)
        // only 1000 search results are available
        const finalTotal: number = data?.total_count <= 1000 ? data?.total_count : 1000
        // 30 is default per page from github API
        setTotalCount(Math.ceil(finalTotal / 30))
    }, [data])

    const showTable = () => {
        return (
            <React.Fragment>
                <table className='table'>
                    <thead>
                        <tr>
                            <th><h1>Name</h1></th>
                            <th><h1>URL</h1></th>
                            <th><h1>Watchers</h1></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items?.length > 0 ? items?.map((item: any, idx: any) => (
                            <tr key={idx}>
                                <td>
                                    <span className='label'>{item?.name}</span>
                                </td>
                                <td>
                                    <span className='label'>
                                        <a href={`${item?.html_url}`} target={'_blank'} rel="noreferrer">{item?.html_url}</a>
                                    </span>
                                </td>
                                <td>
                                    <span className='label'>{item?.watchers}</span>
                                </td>
                            </tr>
                        )) : 
                        <tr>
                            <td colSpan={3}>{'No record to display'}</td>
                        </tr>
                        }
                    </tbody>
                </table> 
                <div className='pagination mt-s mb-s'>
                    <Pagination 
                    totalCount={totalCount}
                    setTotalCount={setTotalCount}
                    choosePage={choosePage}
                    page={page}
                    />
                </div>
            </React.Fragment>
        )
    }

    return (
        <React.Fragment>
            {items ? showTable()
            : null}
        </React.Fragment>
    );
}

export default Table