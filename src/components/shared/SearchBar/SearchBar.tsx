/// <reference types="vite-plugin-svgr/client" />
import { useState, useEffect, useRef, useCallback } from 'react'

import SearchIcon from '@/assets/search-icon.svg?react'
import { useCharactersStore } from '@/store/useStore'

import './SearchBar.scss'

interface SearchBarProps {
  placeholder?: string
}

export const SearchBar = ({
  placeholder = 'SEARCH A CHARACTER...',
}: SearchBarProps) => {
  const isInitialRender = useRef(true)
  const inputRef = useRef<HTMLInputElement>(null)

  const searchQuery = useCharactersStore((state) => state.searchQuery)
  const setSearchQuery = useCharactersStore((state) => state.setSearchQuery)

  const [localQuery, setLocalQuery] = useState(searchQuery)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }
    setSearchQuery(localQuery)
  }, [localQuery, setSearchQuery])

  useEffect(() => {
    if (!searchQuery) {
      setLocalQuery('')
    }
  }, [searchQuery])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalQuery(newValue)
  }, [])

  return (
    <div className="search-bar">
      <SearchIcon
        className="search-icon"
        aria-label="Search character by name"
      />
      <input
        ref={inputRef}
        id="search-bar"
        type="text"
        placeholder={placeholder}
        value={localQuery}
        onChange={handleChange}
      />
    </div>
  )
}
