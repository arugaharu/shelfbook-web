const { nanoid } = require('nanoid');
const shelfbook = require('./shelfbook');

// ADDBOOK ---------------------------
const addBookHandler = (request, h) => {
    const id = nanoid(16);
    const {name, year, author, summary, publisher,pageCount, readPage, reading,} = request.payload;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    if(name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    
    const newBook = {
        name,year,author,summary,publisher,pageCount,readPage,reading,id,finished,insertedAt,
        updatedAt
    }
    shelfbook.push(newBook);

    const isSuccess = shelfbook.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        });
        response.code(201);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
      });
      response.code(500);
      return response;
};


// GETALLBOOK --------------------------------
const getAllBookHandler = (request, h) => {
    const {name, reading, finished} = request.query;

    //Name
    if(name){
        const bookname = shelfbook.filter((book) => book.name.toLowerCase().include(name.toLowerCase()));
        const response = h.response({
            status: 'success',
            data: {
            books: bookname.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
                })),
            },
        });
            response.code(200);
            return response;
        }
        

    //READING
    if(reading){
        // DEKLARASI QUERY PARAMETER
        const bookreading = reading === '1'
        ? shelfbook.filter((book) => book.reading === true)
        : shelfbook.filter((book) => book.reading === false);

        const response = h.response({
            status: 'success',
            data: {
                books: bookreading.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    // FINISHED
    if(finished){
        // DEKLARASI QUERY PARAMETER
        const bookfinished = finished === '1'
        ? shelfbook.filter((book) => book.finished === true)
        : shelfbook.filter((book) => book.finished === false);

        const response = h.response({
            status: 'success',
            data: {
                books: bookfinished.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    // SAAT DAFTAR BUKU KOSONG
    if(!name && !reading && !finished){
        const response = h.response({
            status: 'success',
            data: {
                books: shelfbook.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }
};

// GETBOOKBYID----------------------------------------
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = shelfbook.filter((b) => b.id === bookId)[0];
   
   if (book !== undefined) {
      return {
        status: 'success',
        data: {
          book,
        },
      };
    }
   
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });

    response.code(404);
    return response;
};

//EDITBOOK---------------------------------------
const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher,pageCount, readPage, reading,} = request.payload;
    const updatedAt = new Date().toISOString();
    const index = shelfbook.findIndex((book) => book.id === bookId);
   
    if(name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    if (index !== -1) {
      shelfbook[index] = {
        ...shelfbook[index],
        name,year,author,summary,publisher,pageCount,readPage,reading,updatedAt
    };

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  };

//DELETEBUKU----------------------------------------
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = shelfbook.findIndex((book) => book.id === bookId);
   
    if (index !== -1) {
      shelfbook.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    });
      response.code(200);
      return response;
    }
   
   const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });

    response.code(404);
    return response;
  };




// MODULEEXPORTS------------------------------
module.exports = {addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};