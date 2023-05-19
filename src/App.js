import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Modal, Button } from 'react-bootstrap';
import { useTable } from 'react-table';
import faker from 'faker';
import './styles.css';
import Loading from './Loading';

const generateData = (start, length = 20) =>
  Array.from({ length }).map((_, i) => ({
    id: start + i,
    name: faker.name.findName(),
    address: faker.address.streetAddress(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    dob: faker.date.past().toLocaleDateString(),
  }));

const App = () => {
  const [items, setItems] = useState(generateData(0));
  const [isOpen, setIsOpen] = useState(false);

  const fetchMoreData = () => {
    setTimeout(() => {
      setItems((prevItems) => [
        ...prevItems,
        ...generateData(prevItems.length),
      ]);
    }, 1500);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Address',
        accessor: 'address',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Phone',
        accessor: 'phone',
      },
      {
        Header: 'Date of Birth',
        accessor: 'dob',
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data: items });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Button variant='primary' onClick={() => setIsOpen(true)}>
          Open Modal
        </Button>
      </div>
      <Modal show={isOpen} size='xl' onHide={() => setIsOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ width: '100%', textAlign: 'center' }}>
            React Scrollable Table Modal
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id='scrollableDiv' style={{ height: '80vh', overflow: 'auto' }}>
            <InfiniteScroll
              dataLength={items.length}
              next={fetchMoreData}
              hasMore={true}
              loader={<Loading />}
              scrollableTarget='scrollableDiv'
            >
              <table {...getTableProps()} className='table table-striped'>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps()}>
                          {column.render('Header')}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()}>
                              {cell.render('Cell')}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </InfiniteScroll>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default App;
