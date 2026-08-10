/**
 * Страница редактора (каркас, защищённый авторизацией).
 *
 * Фаза 6: форма заголовка + создание черновика (POST /api/news).
 * Фаза 7: сюда добавится блочный редактор (text/image/quote/code/file),
 * предпросмотр и публикация (сейчас/по дате).
 */

'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '../../components/Navigation';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import type { NewsResponse } from '../../types/api';

export default function EditorPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  // Защита: пока грузится состояние авторизации — ничего не показываем;
  // если пользователь не авторизован — редирект на /login.
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return <p className="muted-text">Загрузка...</p>;
  }

  /** Создаём черновик новости (пока без блоков). */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { data } = await apiClient.post<NewsResponse>('/api/news', {
        title,
        blocks: [],
      });
      setCreatedId(data.news._id);
      setTitle('');
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(message || 'Не удалось создать новость');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navigation />
      <main className="editor">
        <h1 className="editor__title">Новая статья</h1>

        <form className="editor__form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">Заголовок</span>
            <input
              className="field__input field__input--large"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Заголовок статьи..."
              required
            />
          </label>

          <p className="editor__hint">
            Блочный редактор (текст, картинки, цитаты, код, файлы) появится здесь в Фазе 7.
          </p>

          {error && <p className="error-text">{error}</p>}
          {createdId && (
            <p className="success-text">
              Черновик создан.{' '}
              <a href={`/news/${createdId}`}>Открыть</a>
            </p>
          )}

          <button className="btn btn--primary" type="submit" disabled={submitting}>
            {submitting ? 'Сохраняем...' : 'Сохранить черновик'}
          </button>
        </form>
      </main>
    </>
  );
}
