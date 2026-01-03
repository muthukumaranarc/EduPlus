import "./SavedTest.css";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import arrow from "../../../../assets/arrow.png";
import edit from "../../../../assets/edit.png";
import deleteIcon from "../../../../assets/delete.png";
import x from "../../../../assets/x.png";
import axios from "axios";
import Quiz from "./Quiz";

function SavedTest() {
  const { setNavState } = useOutletContext();
  const baseURL = import.meta.env.VITE_API_URL;
  let { deviceWidth } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);

  useEffect(() => {
    setNavState("test");
    fetchGroups();
    // eslint-disable-next-line
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseURL}/test/get-all-group`, {
        withCredentials: true,
      });
      setGroups(res.data.testGroup || []);
    } catch (err) {
      console.error("Failed to load test groups", err);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <p
        style={{
          textAlign: "center",
          marginTop: "80px"
        }}
      >
        Loading...
      </p>
    );
  }

  if (groups.length === 0) {
    return (
      <p
        style={{
          textAlign: "center",
          marginTop: "80px"
        }}
      >
        No data created yet
      </p>
    );
  }


  if (selectedTest) {
    return (
      <Quiz
        groupName={selectedTest.groupName}
        testTitle={selectedTest.testTitle}
        onBack={() => setSelectedTest(null)}
      />
    );
  }

  return (
    <>
      {
        (deviceWidth > 768) ?
          <div className='ac-head' onClick={() => window.history.back()}>
            <img src={arrow} alt="arrow" />
            <p>Actions</p>
          </div> : null
      }

      <div className="tests">
        {
          groups.map((group) => (
            <TestGroup
              group={group}
              setSelectedTest={setSelectedTest}
              setGroups={setGroups}
            />

          ))}
      </div>
    </>
  );
}

function TestGroup({ group, setSelectedTest, setGroups }) {
  const baseURL = import.meta.env.VITE_API_URL;
  const [isEditing, setIsEditing] = useState(false);

  // 🔥 AUTO DELETE GROUP IF EMPTY
  useEffect(() => {
    if (group.group.length === 0) {
      deleteGroup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group.group.length]);

  const deleteGroup = async () => {
    try {
      const res = await axios.delete(
        `${baseURL}/test/delete-group`,
        {
          data: group.name,
          withCredentials: true,
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );

      setGroups(res.data.testGroup || []);
    } catch (err) {
      console.error("Failed to delete group", err);
    }
  };

  return (
    <div className="test-group">
      {/* GROUP HEADER */}
      <div>
        <p>{group.name}</p>

        {isEditing ? (
          <img src={x} alt="close" onClick={() => setIsEditing(false)} />
        ) : (
          <img src={edit} alt="edit" onClick={() => setIsEditing(true)} />
        )}
      </div>

      {/* TEST LIST */}
      <div>
        {group.group.map((test) => (
          <TestBlock
            key={test.title}
            groupName={group.name}
            testTitle={test.title}
            onClick={(groupName, testTitle) =>
              setSelectedTest({ groupName, testTitle })
            }
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setGroups={setGroups}
          />
        ))}
      </div>
    </div>
  );
}
function TestBlock({ groupName, testTitle, onClick, isEditing, setIsEditing, setGroups }) {
  const baseURL = import.meta.env.VITE_API_URL;
  const deleteTest = async (groupName, title) => {
    try {
      const res = await axios.delete(
        `${baseURL}/test/delete-test`,
        {
          data: {
            groupName: groupName,
            title: title,
          },
          withCredentials: true,
        }
      );
      setGroups(res.data.testGroup || []);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to delete test", err);
    }
  };
  return (
    <div
      className="test-block button"
      onClick={() => { !isEditing ? onClick(groupName, testTitle) : null }}
    >
      <p>{testTitle}</p>
      {
        isEditing ?
          <img src={deleteIcon} alt="delete" onClick={() => { deleteTest(groupName, testTitle) }} /> :
          <img src="/src/assets/arrow.png" alt="arrow" />
      }
    </div>
  );
}

export default SavedTest;
