import styles from './Contacts.module.css'
import Guest from "@/Layouts/GuestLayout"
import { PageProps } from "@/types"
import { Contact } from "@/types/contact"
import { CompactTable } from "@table-library/react-table-library/compact"
import { useTheme } from "@table-library/react-table-library/theme"
import { getTheme } from "@table-library/react-table-library/baseline"
import { MdDelete, MdEdit } from "react-icons/md"
import DataTable from '@/Components/DataTable'
import { BiSolidShow } from 'react-icons/bi'
import Swal from 'sweetalert2'
import { useEffect, useState } from 'react'
import axios from 'axios'
import useAxios from '@/Hooks/Axios'
import withReactContent from 'sweetalert2-react-content'
import { capitalize } from '@/Helpers/Helpers'
import moment from 'moment'

interface Props extends PageProps {
  data: Contact[]
}


const COLUMNS = [
  {
    label: "Name", renderCell: (item: Contact) => item.name
  },
  { label: "Phone", renderCell: (item: Contact) => item.phone },
  { label: "Email", renderCell: (item: Contact) => item.email },
  { label: "Address", renderCell: (item: Contact) => item.address },
  {
    label: "Action", renderCell: (item: Contact) => (
      <div className="flex gap-3 justify-center">
        <button className="btn btn-warning btn-sm">
          <MdEdit />
        </button>
        <button className="btn btn-error btn-sm">
          <MdDelete />
        </button>
      </div>
    )
  },
]

const Contacts = (props: Props) => {
  const ReactSwal = withReactContent(Swal)
  const show = (id: number) => {
    ReactSwal.fire({
      showConfirmButton: false,
      showCloseButton: true,
      html: <Show id={id} />
    })
  }
  return (
    <Guest>
      <DataTable
        columns={[
          {
            id: 'id',
            title: 'ID',
            width: 'max-content',
            sort: true
          },
          {
            id: 'name',
            title: 'Name',
            width: 'auto',
            sort: true
          },
          {
            id: 'action',
            title: 'Action',
            width: 'max-content',
            sort: false
          },
        ]}
        data={props.data.map(a => ({
          ...a,
          action: (
            <div className="flex gap-3 justify-center">
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => show(a.id!)}
              >
                <BiSolidShow />
              </button>
              <button className="btn btn-warning btn-sm">
                <MdEdit />
              </button>
              <button className="btn btn-error btn-sm">
                <MdDelete />
              </button>
            </div>
          )
        }))}
        rowClick={{
          onClick: (row) => show(row.id)
        }}
      />
    </Guest>
  )
}

const Show = (props: { id: number }) => {
  const [item, setItem] = useState<Contact>({})
  const { axiosCsrf } = useAxios()
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    
    const fetching = async () => {
      const res = await axiosCsrf.get('/contacts/' + props.id)
      
      if (res.status === 200) {
        setItem(res.data.item)
      } else {
        setItem({})
      }
      setLoading(false)
    }

    fetching()

    return () => {
      controller.abort()  
    }
  }, [])

  if (isLoading) {
    return (
      <span className='loading loading-spinner'></span>
    )
  }

  return (
    <>
      <div>
        <h1 className='font-black text-3xl'>{item.name}</h1>
        {Object.keys(item).filter(a => !['name', 'id'].includes(a)).map((key, idx) => (
          <div key={idx} className='grid grid-cols-1 text-start mb-3'>
            <div className='text-sm text-gray-500'>{capitalize(key.replaceAll('_', ' '))}</div>
            <td className='font-black'>
              {['updated_at', 'created_at'].includes(key) 
                ? moment(item[key as keyof Contact]).toLocaleString() 
                : item[key as keyof Contact]}
            </td>
          </div>
        ))}
      </div>
    </>
  )
}

export default Contacts