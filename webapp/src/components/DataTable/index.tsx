import React from 'react'
import css from './index.module.scss'

interface Column {
  key: string
  title: string
  width: string
  align?: 'left' | 'center' | 'right'
}

interface TableRow {
  [key: string]: React.ReactNode
  actions?: React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: TableRow[]
  headerButtons?: React.ReactNode
  headerStats?: React.ReactNode
  footerContent?: React.ReactNode
  className?: string
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  headerButtons,
  headerStats,
  footerContent, // Добавить это
  className
}) => {
  return (
    <div className={`${css.tableContainer} ${className || ''}`}>
      <div className={css.contentWrapper}>
        <div className={css.tablePanel}>
          <div className={css.header}>
            <div className={css.headerLeft}>
              {headerStats && (
                <div className={css.headerStats}>
                  {headerStats}
                </div>
              )}
            </div>
            <div className={css.headerButtons}>
              {headerButtons}
            </div>
          </div>

          <div className={css.tableWrapper}>
            <div className={css.tableHeader}>
              {columns.map((column) => (
                <div
                  key={column.key}
                  className={css.tableHeaderCell}
                  style={{
                    width: column.width,
                    justifyContent: column.align === 'center' ? 'center' : 
                                  column.align === 'right' ? 'flex-end' : 'flex-start'
                  }}
                >
                  {column.title}
                </div>
              ))}
              {data.some(row => row.actions) && (
                <div
                  className={css.tableHeaderCell}
                  style={{ width: '10%', justifyContent: 'flex-end' }}
                >
                </div>
              )}
            </div>
            
            <div className={css.tableBody}>
              {data.map((row, index) => (
                <div
                  key={index}
                  className={`${css.tableRow} ${index === data.length - 1 ? css.lastRow : ''}`}
                >
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      className={css.tableCell}
                      style={{
                        width: column.width,
                        justifyContent: column.align === 'center' ? 'center' : 
                                      column.align === 'right' ? 'flex-end' : 'flex-start'
                      }}
                    >
                      {row[column.key]}
                    </div>
                  ))}
                  {row.actions && (
                    <div
                      className={css.tableCell}
                      style={{ width: '10%', justifyContent: 'flex-end' }}
                    >
                      {row.actions}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {footerContent && (
              <div className={css.tableFooter}>
                {footerContent}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}