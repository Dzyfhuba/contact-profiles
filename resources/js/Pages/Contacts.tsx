import Guest from "@/Layouts/GuestLayout"
import { PageProps } from "@/types"
import { Contact } from "@/types/contact"
import { CompactTable } from "@table-library/react-table-library/compact"
import { useTheme } from "@table-library/react-table-library/theme"
import { getTheme } from "@table-library/react-table-library/baseline"
import { MdDelete, MdEdit } from "react-icons/md"

interface Props extends PageProps {
  data: Contact[]
}


const COLUMNS = [
  { label: "Name", renderCell: (item: Contact) => item.name },
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
  const theme = useTheme(getTheme())
  return (
    <Guest>
      <CompactTable
        columns={COLUMNS.filter(a => ['name', 'action'].includes(a.label.toLocaleLowerCase()))}
        data={{
          nodes: props.data.map(a => ({
            id: a.id,
            name: a.name,
          }))
        }}
        theme={theme}
      />
    </Guest>
  )
}

export default Contacts