/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
// @ts-nocheck
import { h } from "preact";
import register from "preact-custom-element";
import { FC } from "preact/compat";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { usePagination, useTable } from "react-table";
import styled from "styled-components";
import App from "../../App";
import useCustomEvent from "../../utils/useCustomEvent";
import Skeleton from "../Skeleton";

const dummyColumns = new Array(4)
  .fill({})
  .map((item, i) => ({ accessor: `${i}` }));
const dummyData = new Array(4).fill({});

const TableComp: FC<{ data: string; columns: string }> = ({
  data,
  columns,
}) => {
  const [dataState, setData] = useState(dummyData);
  const [columnsState, setColumns] = useState(dummyColumns);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);

  const run = useCallback(
    ({ parsedData, parsedColumns }) => {
      setData(parsedData);
      setColumns(parsedColumns);
      setLoading(false);
    },
    [dataState, columnsState, loading]
  );

  useEffect(() => {
    if (data && columns) {
      const parsedData: Array<any> = JSON.parse(data);
      const parsedColumns: Array<any> = JSON.parse(columns);
      run({ parsedData, parsedColumns });
    }
  }, [data, columns]);

  return (
    <App>
      <Table
        columns={columnsState}
        data={dataState}
        loading={loading}
        pageCount={pageCount}
      />
    </App>
  );
};

const Table: FC = (props) => {
  const {
    columns,
    data,
    loading,
    pageCount,
    pageCount: controlledPageCount,
  } = props;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    usePagination
  );

  const componentRef = useRef<HTMLTableElement>();
  const dispatchEvent = useCustomEvent({
    ref: componentRef,
    eventName: "tableRowClicked",
  });

  return (
    <Styles>
      <div ref={componentRef} {...getTableProps()} className="table">
        <div>
          {headerGroups.map((headerGroup) => (
            <div
              key={headerGroup.id}
              {...headerGroup.getHeaderGroupProps()}
              className="tr header"
            >
              {headerGroup.headers.map((column) => (
                <div
                  key={column.id}
                  {...column.getHeaderProps()}
                  className="th"
                >
                  {!loading && column.render("Header")}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <div
                onClick={() => dispatchEvent(row.values)}
                key={row.id}
                {...row.getRowProps()}
                className="tr"
              >
                {row.cells.map((cell) => (
                  <div key={cell.value} {...cell.getCellProps()} className="td">
                    {loading ? <Skeleton height={16} /> : cell.render("Cell")}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </Styles>
  );
};

const Styles = styled.div`
  .table {
    font-size: 14px;
    background: ${(props) => props.theme.colors.$D80};
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    width: 100%;
    overflow: hidden;

    .tr.header {
      background: ${(props) => props.theme.colors.$B40};
      height: 42px;
      &:hover {
        background: ${(props) => props.theme.colors.$B40};
        cursor: default;
      }
    }

    .tr {
      height: 54px;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1px solid ${(props) => props.theme.colors.$D60};

      &:hover {
        background: ${(props) => props.theme.colors.$B50};
        cursor: pointer;
        transition: all 120ms ease;
      }

      .th,
      .td {
        display: block;
        flex: 1;
        text-align: left;
        overflow-x: hidden;
        text-overflow: ellipsis;
        padding: 0 30px 0 0;
        align-items: center;
      }

      .th:first-child,
      .td:first-child {
        padding: 0 0 0 30px;
      }
    }
  }
`;
export default TableComp;

register(TableComp, "x-table", ["columns", "data"]);
