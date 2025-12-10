import { useEffect, useState } from "react";
import personService from "./services/persons";
import "./index.css";

const capitalizeName = (name) => {
  return name
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function App() {
  const [persons, setPersons] = useState([]);
  const [message, setMessage] = useState(null);
  const [category, setCategory] = useState("");
  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const [newPerson, setNewPerson] = useState({
    name: "",
    number: "",
  });
  const [filter, setFilter] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const capitalizedPerson = {
      ...newPerson,
      name: capitalizeName(newPerson.name),
    };
    !persons.some((person) => person.name === capitalizedPerson.name)
      ? personService
          .create(capitalizedPerson)
          .then((returnedPerson) => {
            setPersons(persons.concat(returnedPerson));
            setNewPerson({ name: "", number: "" });
            setCategory("added");
            setMessage(`Added ${returnedPerson.name}`);
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          })
          .catch((error) => {
            if (error.response.status === 404) {
              setCategory("deleted");
              setMessage(
                `Information of ${capitalizedPerson.name} has already been removed from server`
              );
              setTimeout(() => {
                setMessage(null);
              }, 5000);
            }
          })
      : personService
          .update(
            persons.find((p) => p.name === capitalizedPerson.name).id,
            capitalizedPerson
          )
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== returnedPerson.id ? person : returnedPerson
              )
            );
            setNewPerson({ name: "", number: "" });
            setCategory("updated");
            setMessage(`Updated ${returnedPerson.name}`);
            setTimeout(() => {
              setMessage(null);
            }, 5000);
          })
          .catch((error) => {
            if (error.response.status === 404) {
              setCategory("deleted");
              setMessage(
                `Information of ${capitalizedPerson.name} has already been removed from server`
              );
              setTimeout(() => {
                setMessage(null);
              }, 5000);
            }
          });
  }

  function handleDelete(id) {
    const person = persons.find((p) => p.id === id);
    window.confirm(`Delete ${person.name} ?`) &&
      personService.deletePerson(id).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
        setCategory("deleted");
        setMessage(`Deleted ${person.name}`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      });
  }

  return (
    <div>
      <h2>{`Phonebook`}</h2>
      <Message message={message} category={category} />
      <Filter filter={filter} setFilter={setFilter} />
      <h3>{`add a new`}</h3>
      <PersonForm
        newPerson={newPerson}
        setNewPerson={setNewPerson}
        handleSubmit={handleSubmit}
      />
      <h3>{`Numbers`}</h3>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  );
}

function Message({ message, category }) {
  if (message === null) {
    return null;
  }

  return <div className={`${category}`}>{message}</div>;
}

function Filter({ filter, setFilter }) {
  return (
    <input
      value={filter}
      onChange={(event) => setFilter(event.target.value)}
      placeholder="input name..."
    />
  );
}

function PersonForm({ newPerson, setNewPerson, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        {`name:`}{" "}
        <input
          value={newPerson.name}
          onChange={(event) =>
            setNewPerson({ ...newPerson, name: event.target.value })
          }
        />
      </div>
      <div>
        {`number:`}{" "}
        <input
          value={newPerson.number}
          onChange={(event) =>
            setNewPerson({ ...newPerson, number: event.target.value })
          }
        />
      </div>
      <div>
        <button type="submit">{`add`}</button>
      </div>
    </form>
  );
}

function Persons({ persons, filter, handleDelete }) {
  return persons.map((person) => {
    if (person.name.toLowerCase().includes(filter.toLowerCase()))
      return (
        <p key={person.name}>
          {person.name} {person.number}{" "}
          <button onClick={() => handleDelete(person.id)}>{`delete`}</button>
        </p>
      );
  });
}
