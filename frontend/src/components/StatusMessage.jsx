import React from 'react'

// Centered message for loading and error states, with an optional retry
const StatusMessage = ({ children, retry = false }) => (
  <div className='py-20 text-center text-gray-500' role='status'>
    <p>{children}</p>
    {retry && (
      <button type='button' onClick={() => window.location.reload()} className='btn-outline mt-6'>
        TRY AGAIN
      </button>
    )}
  </div>
)

export const LOAD_ERROR_TEXT = "We couldn't load the flowers right now. Please check your connection and try again."

export default StatusMessage
