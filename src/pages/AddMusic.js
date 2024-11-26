import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { addMusic } from "../services/musicService"; // Importe a função addMusic
import styles from "./AddMusic.module.css";

function AddMusic() {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    url: "",
  });
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addMusic(formData); // Use a função centralizada
      navigate("/minhas-musicas", { state: { feedback: "Música adicionada com sucesso!" } });
    } catch (error) {
      console.error("Erro ao adicionar música:", error);
      setFeedback({ message: "Erro ao adicionar música.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.formContainer}>
        <h2>Adicionar Música</h2>
        {feedback && (
          <div className={`${styles.feedback} ${styles[feedback.type]}`}>
            {feedback.message}
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Título</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Digite o título da música"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="artist">Artista</label>
            <input
              type="text"
              id="artist"
              name="artist"
              value={formData.artist}
              onChange={handleInputChange}
              placeholder="Digite o nome do artista"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="url">URL</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="Digite a URL do YouTube"
              required
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? "Adicionando..." : "Adicionar Música"}
          </button>
        </form>
        {isLoading && <div className={styles.loader}></div>}
      </div>
    </div>
  );
}

export default AddMusic;
