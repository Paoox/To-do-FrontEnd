import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function TablaUsuarios({ usuarios }) {
  const navigate = useNavigate();

  const handleAvatarClick = (id) => {
    navigate(`/perfil/${id}`);
  };

  const columnas = [
    { field: 'nombre', headerName: 'Nombre', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'telefono', headerName: 'Teléfono', width: 150 },
    { field: 'visualizaciones', headerName: 'Visualizaciones', width: 150 },
    {
      field: 'fechaFormateada',
      headerName: 'Fecha de Registro',
      width: 200,
    },
    {
      field: 'avatarUrl',
      headerName: 'Avatar',
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const avatarUrl = params.value?.startsWith('http')
          ? params.value
          : `http://localhost:8080${params.value}`;

        return (
          <Avatar
            alt="avatar"
            src={avatarUrl}
            sx={{ width: 40, height: 40, cursor: 'pointer' }}
            onClick={() => handleAvatarClick(params.row.id)}
          />
        );
      },
    },
  ];

  return (
    <Box sx={{ width: 'auto', padding: 2 }}>
      <DataGrid
        rows={usuarios}
        columns={columnas}
        getRowId={(row) => row.id}
        autoHeight
        pagination
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
              page: 0,
            },
          },
        }}
        pageSizeOptions={[5]}
      />
    </Box>
  );
}
