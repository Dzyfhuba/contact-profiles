import DataTable from '@/Components/DataTable'
import Input from '@/Components/Input'
import { capitalize } from '@/Helpers/Helpers'
import useAxios from '@/Hooks/Axios'
import Guest from "@/Layouts/GuestLayout"
import { PageProps } from "@/types"
import { Contact } from "@/types/contact"
import { router } from '@inertiajs/react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { BiSolidShow } from 'react-icons/bi'
import { MdDelete, MdEdit } from "react-icons/md"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

interface Props extends PageProps {
  data: Contact[]
}

const Contacts = (props: Props) => {
  const ReactSwal = withReactContent(Swal)
  const show = (row: Contact) => {
    ReactSwal.fire({
      title: row.name,
      showConfirmButton: false,
      showCloseButton: true,
      html: <Show id={row.id!} />
    })
  }
  const {axiosCsrf} = useAxios()

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
                onClick={() => show(a)}
              >
                <BiSolidShow />
              </button>
              <button
                className="btn btn-warning btn-sm"
                onClick={async () => {
                  const res = await axiosCsrf.get(`/contacts/${a.id}`)
                  if (res.status !== 200){
                    ReactSwal.fire({
                      title: 'Error',
                      icon: 'error',
                      text: res.data,
                    })
                    return
                  }
                  const defaultItem = res.data.item
                  ReactSwal.fire({
                    title: 'Edit Contact Profile',
                    showCloseButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Save',
                    confirmButtonColor: '#FF751A',
                    html: (
                      <>
                        <Input
                          htmlFor='name'
                          label='Name'
                          name='name'
                          placeholder='Name'
                          defaultValue={defaultItem.name}
                          required
                        />
                        <Input
                          htmlFor='phone'
                          label='Phone'
                          name='phone'
                          placeholder='Phone'
                          type='tel'
                          defaultValue={defaultItem.phone}
                          required
                        />
                        <Input
                          htmlFor='email'
                          label='Email'
                          name='email'
                          placeholder='Email'
                          type='email'
                          defaultValue={defaultItem.email}
                          required
                        />
                        <Input
                          htmlFor='address'
                          label='Address'
                          name='address'
                          placeholder='Address'
                          defaultValue={defaultItem.address}
                          required
                        />
                      </>
                    ),
                    preConfirm: () => ({
                      name: (document.querySelector('#name') as HTMLInputElement).value,
                      phone: (document.querySelector('#phone') as HTMLInputElement).value,
                      email: (document.querySelector('#email') as HTMLInputElement).value,
                      address: (document.querySelector('#address') as HTMLInputElement).value,
                    })
                  })
                    .then(async ({isConfirmed, value}) => {
                      if (isConfirmed) {
                        const res = await axiosCsrf.put(`/contacts/${a.id}`, value)

                        if (res.status === 201) {
                          Swal.fire({
                            title: 'Success',
                            icon: 'success'
                          }).then(() => {
                            router.get('/', undefined, {
                              replace: true,
                              preserveScroll: true
                            })
                            setTimeout(() => {
                              Swal.close()
                            }, 500)
                          })
                        } else {
                          console.log(res)
                          Swal.fire({
                            title: `Status Code: ${res.status}`,
                            icon: 'error',
                            html: Object.values(res.data.error).join('<br/>')
                          })
                        }
                      }
                    })
                }}
              >
                <MdEdit />
              </button>
              <button className="btn btn-error btn-sm">
                <MdDelete />
              </button>
            </div>
          )
        }))}
        rowClick={{
          onClick: (row) => show(row)
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