import { useState } from 'react';

const Form = ({ onSubmit }) => {
  const [number, setNumber] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (number && !isNaN(number) && number > 0 && number <= 1000) {
      onSubmit(parseInt(number));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="numberInput">Entrez un nombre (1-1000) :</label>
      <input
        type="number"
        id="numberInput"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        min="1"
        max="1000"
        required
      />
      <button type="submit">Soumettre</button>
    </form>
  );
};

export default Form;
