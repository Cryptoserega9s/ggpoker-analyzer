import { useState } from 'react';
import { FileInput, Button, Group, Text, Box } from '@mantine/core';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleUpload = async () => {
        if (!file) {
            setIsError(true);
            setResponseMessage('Пожалуйста, выберите ZIP-архив для загрузки.');
            return;
        }

        setUploading(true);
        setIsError(false);
        setResponseMessage('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Токен аутентификации не найден. Пожалуйста, войдите снова.');
            }

            const response = await axios.post('http://localhost:5000/api/hands/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            setIsError(false);
            setResponseMessage(response.data.message);

        } catch (error: any) {
            setIsError(true);
            setResponseMessage(error.response?.data?.message || error.message || 'Произошла неизвестная ошибка.');
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box maw={400} mx="auto">
            <Group>
                <FileInput
                    label="Архив с историей раздач"
                    placeholder="Выберите .zip файл" // Изменено
                    value={file}
                    onChange={setFile}
                    style={{ flex: 1 }}
                    accept=".zip" // --- ИЗМЕНЕНО: Принимаем только .zip файлы ---
                />
                <Button onClick={handleUpload} loading={uploading} mt={25}>
                    Загрузить
                </Button>
            </Group>

            {responseMessage && (
                <Text c={isError ? 'red' : 'green'} mt="sm">
                    {responseMessage}
                </Text>
            )}
        </Box>
    );
};

export default FileUpload;