import { Link, router } from '@inertiajs/react'
import {
  CellSelect as CS,
  HeaderCellSelect,
  SelectClickTypes,
  SelectTypes,
  useRowSelect
} from '@table-library/react-table-library/select'
import {
  Body,
  Cell,
  Header,
  HeaderCell,
  HeaderRow,
  OnClick,
  Row,
  Table,
  TableNode
} from '@table-library/react-table-library/table'
import { useTheme } from '@table-library/react-table-library/theme'
import { MiddlewareFunction } from '@table-library/react-table-library/types/common'
import { HTMLAttributes, ReactNode, useEffect, useRef, useState } from 'react'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import styles from './DataTable.module.css'
import { capitalize, findArrayDifferences } from '@/Helpers/Helpers'
import Swal from 'sweetalert2'

const CellSelect = (props: HTMLAttributes<HTMLElement> & {
  item: TableNode
}) => {
  return (
    <CS {...props}>{props.children}</CS>
  )
}


export type Column = {
  id: string,
  title: string,
  sort: boolean,
  width: string,
  hide?: boolean,
  type?: 'text' | 'date' | 'datetime'
}

export type DataType = {
  [key: string]: string | number | boolean | null | undefined | Date | ReactNode
}

type Props<T> = {
  data: T[],
  columns: Column[],
  enableSelect?: boolean,
  onSelectChange?: (selected: number[]) => void,
  onSearch?: (column: Column, value: string) => void
  perserveScroll?: boolean,
  rowClick?: {
    onClick?: OnClick<T & TableNode>,
    onDoubleClick?: OnClick<T & TableNode>,
  }
  lazy?: boolean,
  remainingData?: boolean,

}

const DataTable = <T extends object>(props: Props<T>) => {
  if (!props.data.length) {
    return (
      <div className='flex justify-center items-center w-full h-full'>
        <p className='text-center text-gray-500'>No Data</p>
      </div>
    )
  }

  const data = {
    nodes: props.data.map((e, i) => ({ id: i + 1, ...e }))
  }
  if (props.columns.length !== Object.keys(props.data[0]).length) {
    console.error('Columns Length and Data Shape not same')
    console.error('Columns Length: ', props.columns.length)
    console.error('Data Shape: ', Object.keys(props.data[0]).length)
    console.error('Columns: ', props.columns)
    console.error('Data: ', props.data)

    const diff = findArrayDifferences(Object.keys(props.data[0]), props.columns.map(e => e.id))
    console.error('Diff: ', diff)

    return (
      <div>
        <p>Columns Length and Data Shape not same</p>
        <p>Columns Length: {props.columns.length}</p>
        <p>Data Shape: {Object.keys(props.data[0]).length}</p>
      </div>
    )
  }

  const columns = props.columns.filter(e => !e.hide)


  const headerRowGridTC = columns.map((column) => {
    if (column.hide) return ''
    if (column.width.includes('-content')) {
      return column.width
    }
    return `minmax(${column.width}, 1fr)`
  }).join(' ')

  const theme = useTheme({
    Table: `
      --data-table-library_grid-template-columns: ${headerRowGridTC} !important;
      border-radius: 0px !important;
    `,
    BaseCell: `
      background-color: transparent;
      padding: 2px 4px;
      &:first-of-type  {
        background-color: transparent !important;
      }
      &:first-of-type input {
        background-color: transparent !important;
        border-color: #6b7280 !important;
        box-shadow: none !important
      }
    `,
  })

  const onSelectChange: MiddlewareFunction = (_, state) => {
    props.onSelectChange?.(state.ids)
  }

  const select = useRowSelect(data, {
    onChange: onSelectChange,
  },
  {
    rowSelect: SelectTypes.MultiSelect,
    isPartialToAll: true,
    clickType: SelectClickTypes.ButtonClick,
  })

  const openSearch = (column: Column) => {
    const queryKeyValueArr = window.location.search.split('&').map(e => e.replace('?', '')).map(e => {
      const [key, value] = e.split('=')
      return { key, value }
    })
    console.log(queryKeyValueArr)
    const defaultValue = queryKeyValueArr.filter(e => e.key === column.id)[0]?.value || ''
    Swal.fire({
      title: `Search By ${column.title}`,
      input: 'text',
      inputPlaceholder: capitalize(column.title),
      showConfirmButton: true,
      inputAttributes: {
        required: '',
      },
      inputValue: defaultValue,
      validationMessage: 'This field is required',
    }).then(({ isConfirmed, value }) => {
      if (isConfirmed && props.onSearch) props.onSearch(column, value)
    })
  }
  const direction = window.location.search.split('&').filter(e => e.includes('direction'))[0]?.split('=')[1]
  const sort = window.location.search.split('&').filter(e => e.includes('sort'))[0]?.split('=')[1]

  const isMobile = window.innerWidth <= 640

  return (
    <>
      <Table
        data={data}
        theme={theme}
        select={select}
        layout={{ custom: true, horizontalScroll: true }}
      >
        {(tableList: TableNode[]) => {
          return (
            <>
              <Header>
                <HeaderRow>
                  {
                    props.enableSelect ? (
                      <HeaderCellSelect className={styles.headerCell} />
                    ) : <></>
                  }
                  {columns.map((column) => (
                    <HeaderCell
                      key={column.id}
                      className={styles.headerCell + (props.onSearch ? ' hover:cursor-pointer' : '')}
                      onClick={() => {
                        // if (!isMobile && props.onSearch) openSearch(column)
                        if (props.onSearch) openSearch(column)
                      }}
                    // onDoubleClick={() => {
                    //   if (isMobile && props.onSearch) openSearch(column)
                    // }}
                    >
                      <span>{column.title}</span>
                      {column.sort && (
                        <div className={styles.sort}>
                          <button
                            className={styles.btnSort + (column.sort ? '' : ' hidden')}
                            onClick={(e) => {
                              e.stopPropagation()

                              const uri = new URL(window.location.href)
                              // get all query params except sort and direction
                              const queries = uri.searchParams.toString().split('&').filter(e => !e.includes('sort') && !e.includes('direction'))
                              // split query params into key value pair
                              const queriesKeyValueArr = queries.map(e => e.split('='))
                              // convert key value pair into object
                              const queriesKeyValueObj = Object.fromEntries(queriesKeyValueArr)
                              console.log(queriesKeyValueObj)

                              if (direction === 'asc') return router.get(window.location.pathname, {
                                ...queriesKeyValueObj,
                                sort: column.id,
                                direction: 'desc'
                              })
                              if (direction === 'desc') return router.get(window.location.pathname, queriesKeyValueObj)

                              router.get(window.location.pathname, {
                                ...queriesKeyValueObj,
                                sort: column.id,
                                direction: 'asc'
                              }, {
                                preserveScroll: true
                              })
                            }}
                          >
                            {column.id !== sort && !direction ? <FaSort size={14} /> : (
                              column.id === sort && direction === 'asc' ? <FaSortUp size={14} /> : (
                                column.id === sort && direction === 'desc' ? <FaSortDown size={14} /> : <FaSort size={14} />
                              )
                            )}
                          </button>
                        </div>
                      )}
                    </HeaderCell>
                  ))}
                </HeaderRow>
              </Header>
              <Body>
                {tableList.map((row) => {
                  return (
                    <Row
                      key={row.id}
                      id={row.id}
                      item={row}
                      className={styles.row + ' group' + (props.rowClick ? ' hover:cursor-pointer select-none' : '')}
                      onDoubleClick={(node, e) => {
                        props.rowClick?.onDoubleClick?.(node as T & TableNode, e)
                      }}
                      onClick={(node, e) => {
                        props.rowClick?.onClick?.(node as T & TableNode, e)
                      }}
                    >
                      {
                        props.enableSelect ? (
                          <CellSelect
                            item={row}
                            className={styles.cell + ' group-hover:!bg-base-200 group-active:!bg-base-300'}
                          />
                        ) : <></>
                      }
                      {
                        columns.map((key) => (
                          <Cell
                            key={key.id}
                            className={styles.cell + ' group-hover:!bg-base-200 group-active:!bg-base-300'}
                          >
                            {row[key.id]}
                          </Cell>
                        ))
                      }
                    </Row>
                  )
                })}
              </Body>
            </>
          )
        }}
      </Table>
    </>
  )
}

export default DataTable