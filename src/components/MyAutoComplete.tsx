import { getYandereTagList } from '@/api/imageApi'
import { Input, Listbox, ListboxItem } from '@nextui-org/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import type { Tag } from '../interfaces/image'
import Icon from './Icon'

interface Props {
  name?: string
  /**
   * @description 搜索框的值
   */
  defaultValue: string
}

const map = new Map([
  [1, 'text-warning'], // Artist
  [3, 'text-secondary'], // Copyright
  [4, 'text-success'], // Character
  [5, 'text-primary'], // Circle
])

export default function MyAutoComplete(props: Props): React.ReactElement {
  const { defaultValue, name } = props
  const [inputValue, setInputValue] = useState<string>(defaultValue) // 搜索框的值
  const inputRef = useRef<HTMLInputElement>(null) // 搜索框的引用
  const listboxRef = useRef<HTMLElement>(null) // 自动补全的引用
  const [tagList, setTagList] = useState<Tag[]>([]) // 自动补全的列表

  useEffect(() => {
    setInputValue(defaultValue)
  }, [defaultValue])

  // 获取自动补全的列表
  const fetchTagList = useCallback(async (tag: string) => {
    const data: Tag[] = await getYandereTagList(tag)
    return data
  }, [])

  // 搜索框输入时，自动补全的逻辑
  const handleTagListChange = useDebouncedCallback(async (value: string) => {
    const lastTag = value.split(' ').at(-1)
    if (!lastTag) return setTagList([])
    const newTagList = await fetchTagList(lastTag)
    setTagList(newTagList)
  }, 300)

  // 选择自动补全的项时，更新搜索框的值
  const handleSelect = useCallback(
    (key: React.Key) => {
      const newValue = (inputValue.split(' ').slice(0, -1).join(' ') +
        key) as string
      setInputValue(newValue)
      inputRef.current?.focus()
    },
    [inputValue]
  )

  // 搜索框的值改变时的逻辑
  const handleValueChange = useCallback(
    (value: string) => {
      const newValue = value.replace(/\s+/g, ' ')
      setInputValue(newValue)

      handleTagListChange(newValue)
    },
    [handleTagListChange]
  )

  // 搜索框按下键盘时的逻辑
  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (e.key === 'Enter' || e.key === 'Escape') {
        e.currentTarget.blur()
      }
      if (e.key === 'ArrowDown') {
        const option = listboxRef.current?.firstElementChild
          ?.firstElementChild as HTMLElement
        option.focus()
      }
      if (e.key === 'ArrowUp') {
        const option = listboxRef.current?.firstElementChild
          ?.lastElementChild as HTMLElement
        option.focus()
      }
    },
    []
  )

  const listBoxItem = (tag: Tag) => {
    const color = map.get(tag.type) || ''
    const lastInputValue = inputValue.split(' ').at(-1) || ''
    const highlightedName = tag.name.replace(
      new RegExp(`(${lastInputValue})`, 'g'),
      '<strong>$1</strong>'
    )
    return (
      <ListboxItem
        key={tag.name}
        textValue={tag.name}
        endContent={
          <span className="text-small text-primary">{tag.count}</span>
        }
      >
        {lastInputValue ? (
          <span
            className={color}
            dangerouslySetInnerHTML={{ __html: highlightedName }}
          />
        ) : (
          tag.name
        )}
      </ListboxItem>
    )
  }

  return (
    <div className="group relative transition-width sm:w-60 sm:focus-within:w-80">
      <Input
        placeholder="Type to search..."
        isClearable
        size="sm"
        variant="bordered"
        ref={inputRef}
        name={name}
        value={inputValue}
        onValueChange={handleValueChange}
        onKeyUp={handleKeyUp}
        classNames={{
          inputWrapper: 'rounded-full',
        }}
        startContent={
          <Icon name="search" className="pointer-events-none select-none" />
        }
      />
      <div
        className="absolute w-full origin-bottom -translate-y-[calc(100%+3.25em)] scale-0 rounded-md
                  bg-background/90 p-1 opacity-0 backdrop-blur-md backdrop-saturate-150
                  transition-transform-opacity group-focus-within:scale-100 group-focus-within:opacity-100"
      >
        <Listbox
          ref={listboxRef}
          items={tagList}
          variant="flat"
          color="primary"
          aria-label="tags"
          onAction={handleSelect}
        >
          {listBoxItem}
        </Listbox>
      </div>
    </div>
  )
}
