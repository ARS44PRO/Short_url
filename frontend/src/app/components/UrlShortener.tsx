"use client";

import { use, useState } from 'react';
import { SERVER_URL } from '../../config/static';

const CopyIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;
const TrashIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

type body = {
  link: string,
  message: string
}

type body_info = {
  originalUrl: string,
  createdAt: string,
  clickCount: string
}

type body_analyt = {
  ip: string[],
  clickCount: string
}

export default function UrlShortener() {
  const [activeTab, setActiveTab] = useState('create');
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopy] = useState(false);
  const [url, seturl] = useState('');
  const [date, setdate] = useState('');
  const [alias, setalias] = useState('');
  const [error, setError] = useState(false);
  const [del_url, setDel_url] = useState('');
  const [info_get, setInfo_get] = useState({originalUrl: '', createdAt: '', clickCount: ''});
  const [info_analyt, setInfo_alanyt] = useState({ip: [''], clickCount: ''});

  const handleShorten = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCopy(false);
    setShortUrl('');
    
  const data = {
    originalUrl: url,
    ...(alias && { alias: alias }),
    ...(date && { expiresAt: date })
  };
    
    await fetch(`${SERVER_URL}/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    } 
    ).then(res => {
      if (res.status==400){
        setError(true);
        return false;
      } else {
        return res.json();
      }
    })
    .then((body: body)=>{
      if (body){
        setShortUrl(body.link);
      }
    });

    seturl('');
    setdate('');
    setalias('');

    
  };

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mass = del_url.split('/')
    await fetch(`${SERVER_URL}/delete/${mass[mass.length-1]}`,{
      method: 'DELETE'
    });

    setDel_url('');
  };

  const handleInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const mass = shortUrl.split('/')
    await fetch(`${SERVER_URL}/info/${mass[mass.length-1]}`,{
      method: 'GET'
    }).then((res)=>{
      if (res.status==200){
        return res.json();
      } else {
        setError(true);
        return false
      }
    }).then((body: body_info)=>{
      const day = new Date(body.createdAt);
      setInfo_get({
        originalUrl: body.originalUrl,
        createdAt: `${day.getDate()}.${day.getMonth()+1}.${day.getFullYear()}`,
        clickCount: body.clickCount
      });
    });
  }

  const handleAnalyt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const mass = shortUrl.split('/')
    await fetch(`${SERVER_URL}/analytics/${mass[mass.length-1]}`,{
      method: 'GET'
    }).then((res)=>{
      if (res.status==200){
        return res.json();
      } else {
        setError(true);
        return false
      }
    }).then((body: body_analyt)=>{
      setInfo_alanyt(body);
    });
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'create':
        return (
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <form onSubmit={handleShorten}>
                <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Введите длинный URL для сокращения:
                </label>
                <div className='flex flex-col gap-2'>
                <input
                  type="url"
                  id="longUrl"
                  name="longUrl"
                  value={url}
                  onChange={(e)=>{
                    setError(false);
                    setShortUrl('');
                    seturl(e.target.value.trim())}}
                  placeholder="https://your long url/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />{error?
                (<p className='mx-1 mt-0.01 mb-2 text-sm text-red-500'>Проверьте формат url</p>):null
                }
                <input
                  type="text"
                  id="alias"
                  name="alias"
                  maxLength={20}
                  value={alias}
                  onChange={(e)=>{
                    setError(false);
                    setShortUrl('');
                    setalias(e.target.value.trim())}}
                  placeholder="your alias, optional"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={date}
                  onChange={(e)=>{
                    setError(false);
                    setShortUrl('');
                    setdate(e.target.value)}}
                  placeholder="your working date, optional"
                  className="w-fit pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Сократить
                  </button>
                </div>
              </form>
            </div>

            {shortUrl && (
              <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
                 <p className="text-sm font-medium text-green-800 mb-2">🎉 Ваша короткая ссылка:</p>
                 <div className="flex items-center justify-between bg-white p-2 rounded-md">
                    <span className="text-gray-900 font-mono">{SERVER_URL+'/'+shortUrl}</span>
                    {!copied?(
                    <button onClick={async ()=>{
                      await navigator.clipboard.writeText(SERVER_URL+'/'+shortUrl);
                      setCopy(true);
                      }} className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700">
                      <CopyIcon /> Копировать
                    </button>
                    ):(
                    <button className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-md">
                      <CopyIcon /> Скопировано
                    </button>
                    )
                    }
                 </div>
              </div>
            )}
            

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gray-50 px-2 text-sm text-gray-500"/>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-2xl">
              <form onSubmit={handleDelete}>
                <label htmlFor="deleteUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Введите короткий URL для удаления:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="deleteUrl"
                    name="deleteUrl"
                    placeholder="https://yout short url/..."
                    value={del_url}
                    onChange={(e)=>{
                      setError(false);
                      setDel_url(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 flex items-center gap-2">
                    <TrashIcon /> Удалить
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      case 'info':
        return (
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className='flex flex-row gap-10'>
              <form className='p-2 rounded-sm border-2 border-gray-400' onSubmit={handleInfo}>
                <label htmlFor="infoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Введите короткий URL для получения информации:
                </label>
                <div className='flex flex-col gap-2'>
                <input
                  type="url"
                  id="infoUrl"
                  name="infoUrl"
                  value={shortUrl}
                  onChange={(e)=>{
                    setError(false);
                    setShortUrl(e.target.value.trim())}}
                  placeholder="https://your short url/..."
                  className="w-fit px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                </div>
                {error?
                (<p className='mx-1 mt-0.01 mb-2 text-sm text-red-500'>Проверьте формат url</p>):null
                }
                <div className="mt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Получить информацию
                  </button>
                </div>
              </form>
              {info_get.originalUrl?
              (<div className='flex flex-col gap-2'>
                <span>
                  Длинная ссылка: {info_get.originalUrl}
                </span>
                <span>
                  Дата создания: {info_get.createdAt}
                </span>
                <span>
                  Количество переходов: {info_get.clickCount}
                </span>
              </div>):null
              }
              </div>
            </div>
          </div>
        );
      case 'stats':
        return (
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className='flex flex-row gap-10'>
              <form className='p-2 rounded-sm border-2 border-gray-400' onSubmit={handleAnalyt}>
                <label htmlFor="infoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Введите короткий URL для получения статистики:
                </label>
                <div className='flex flex-col gap-2'>
                <input
                  type="url"
                  id="infoUrl"
                  name="infoUrl"
                  value={shortUrl}
                  onChange={(e)=>{
                    setError(false);
                    setShortUrl(e.target.value.trim())}}
                  placeholder="https://your short url/..."
                  className="w-fit px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                </div>
                {error?
                (<p className='mx-1 mt-0.01 mb-2 text-sm text-red-500'>Проверьте формат url</p>):null
                }
                <div className="mt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Получить статистику
                  </button>
                </div>
              </form>
              {info_analyt.clickCount || info_analyt.clickCount=='0'?
              (<div className='flex flex-col gap-2'>
                <span>
                  Количество переходов: {info_analyt.clickCount}
                </span>
                <label htmlFor="spisok">Последние 5 ip:</label>
                <ul id='spisok' className='list-disc list-inside space-y-1'>
                  {info_analyt.ip.map((ip, index) => (
                    <li className='' key={index}>{ip}</li>
                  ))}
                </ul>
              </div>):null
              }
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const TabButton = ({ id, label }: { id: string; label: string }) => (
    <button
      onClick={() => {
        setInfo_alanyt({ip: [''], clickCount: ''})
        setInfo_get({originalUrl: '', createdAt: '', clickCount: ''});
        setShortUrl('');
        setError(false);
        setActiveTab(id);
      }}
      className={`px-4 py-2 text-sm font-medium rounded-md ${
        activeTab === id
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="mb-6 flex gap-2">
        <TabButton id="create" label="Создать / Удалить" />
        <TabButton id="info" label="Информация" />
        <TabButton id="stats" label="Статистика" />
      </div>

      <div>{renderContent()}</div>
    </div>
  );
}