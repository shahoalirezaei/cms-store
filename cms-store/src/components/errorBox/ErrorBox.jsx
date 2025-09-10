import React from 'react'
// import './ErrorBox.css'

export default function ErrorBox({ msg, colCount }) {
  return (
    <tr>
      <td colSpan={colCount} className="text-center py-4 text-blue-50 text-base lg:text:2xl bg-red-800">
        {msg}
      </td>
    </tr>
  )
}
