import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, Loader2 ,ChevronRight} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api";


export default function Dashboard({onFileSelect}) {
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate(); 

  // Загрузка истории документов при открытии страницы
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/documents/");
      setDocuments(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке истории:", error);
    }
  };

  // Обработчик Drag-and-Drop
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await api.post(
          "/documents/upload-and-analyze/",
          formData,
        );
        localStorage.setItem('lastId', response.data.document_id);
        localStorage.setItem('lastFileName', file.name);
        // После успешного анализа перенаправляем на страницу результатов
        navigate(`/result/${response.data.document_id}`);
      } catch (error) {
        console.error("Ошибка загрузки:", error);
        alert("Не удалось проанализировать документ");
      } finally {
        setIsUploading(false);
      }
    },
    [navigate],
  );
  

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
  });

  return (
  <div className="max-w-6xl mx-auto p-10 font-sans transition-colors duration-300">
  
  {/* HEADER SECTION */}
  <div className="mb-10">
    <h1 className="text-[28px] font-black text-[var(--foreground)] tracking-tight">
      AI Анализатор ТЗ
    </h1>
    <p className="text-[var(--muted)] text-sm font-medium mt-1">
      Загрузите документ для мгновенной проверки качества и соответствия стандартам.
    </p>
  </div>

  {/* ЗОНА ЗАГРУЗКИ ФАЙЛОВ */}
  <div
    {...getRootProps()}
    className={`relative border-2 border-dashed rounded-[32px] p-16 text-center cursor-pointer transition-all duration-300 ${
      isDragActive
        ? "border-[var(--accent)] bg-[var(--hover)] scale-[0.99]"
        : "border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--accent)] hover:bg-[var(--hover)]"
    }`}
  >
    <input {...getInputProps()} />
    
    {isUploading ? (
      <div className="flex flex-col items-center">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-[var(--accent)] animate-spin" />
        </div>
        <p className="text-xl font-bold text-[var(--foreground)] mt-6">ИИ анализирует документ...</p>
      </div>
    ) : (
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 bg-[var(--hover)] rounded-3xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
          <UploadCloud className="w-10 h-10 text-[var(--accent)]" />
        </div>
        <p className="text-xl font-bold text-[var(--foreground)]">
          Перетащите файл ТЗ сюда
        </p>
        <p className="text-[var(--muted)] font-medium mt-2">
          или <span className="text-[var(--accent)] underline decoration-2 underline-offset-4">выберите файл</span>
        </p>
        <div className="flex gap-4 mt-8">
          {['PDF', 'DOCX', 'TXT'].map(type => (
            <span key={type} className="px-3 py-1 bg-[var(--hover)] text-[var(--muted)] text-[10px] font-black rounded-lg uppercase tracking-wider">
              {type}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>

  {/* ТАБЛИЦА ИСТОРИИ */}
  <div className="mt-16">
    <div className="flex items-center justify-between mb-6 px-2">
      <h2 className="text-lg font-bold text-[var(--foreground)]">История загрузок</h2>
      <span className="text-[11px] font-black text-[var(--muted)] opacity-50 uppercase tracking-[0.2em]">
        {documents.length} Документов
      </span>
    </div>

    <div className="bg-[var(--card)] rounded-[24px] border border-[var(--card-border)] shadow-sm overflow-hidden backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[var(--hover)] opacity-70">
            <th className="p-5 text-[11px] font-black text-[var(--muted)] uppercase tracking-wider">Название файла</th>
            <th className="p-5 text-[11px] font-black text-[var(--muted)] uppercase tracking-wider">Дата анализа</th>
            <th className="p-5 text-[11px] font-black text-[var(--muted)] uppercase tracking-wider">Качество</th>
            <th className="p-5 text-[11px] font-black text-[var(--muted)] uppercase tracking-wider text-right">Действие</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--card-border)]">
          {documents.map((doc) => (
            <tr key={doc.id} className="group hover:bg-[var(--hover)] transition-colors">
              <td className="p-5">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[var(--hover)] rounded-xl flex items-center justify-center mr-4">
                    <FileText className="w-5 h-5 text-[var(--muted)]" />
                  </div>
                  <span className="font-bold text-[var(--foreground)] text-sm">{doc.filename}</span>
                </div>
              </td>
              <td className="p-5 text-sm text-[var(--muted)] font-medium">
                {new Date(doc.upload_time).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
              </td>
              <td className="p-5">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 w-16 bg-[var(--hover)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--accent)] rounded-full shadow-[0_0_8px_var(--accent)]" style={{ width: `${doc.score || 0}%` }} />
                  </div>
                  <span className="text-sm font-black text-[var(--foreground)]">
                    {doc.score ? `${doc.score}%` : "—"}
                  </span>
                </div>
              </td>
              <td className="p-5 text-right">
                <button
                  onClick={() => {
                    onFileSelect(doc.id, doc.filename);
                    navigate(`/result/${doc.id}`); 
                  }}
                  className="px-5 py-2.5 bg-[var(--card)] border border-[var(--card-border)] text-[var(--foreground)] text-[13px] font-bold rounded-xl hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all shadow-sm"
                >
                  Открыть
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
  );
}
