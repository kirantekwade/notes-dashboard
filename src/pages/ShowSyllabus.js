import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

export default function ShowSyllabus() {
  const [lang, setLang] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const [syllabusContent, setSyllabusContent] = useState([]);

  useEffect(() => {
    if (id === "C") {
      setLang("C Programming");
    } else if (id === "Machine") {
      setLang("Machine Learning");
    } else if (id === "DS") {
      setLang("Data Structure");
    } else {
      setLang(id);
    }
  }, [id]);

  useEffect(() => {
    console.log('lang', lang);
    const fetchData = async () => {
      try {
        const response = await fetch('https://us-central1-flutter-chedo.cloudfunctions.net/chedoImsApi/getSubjects');
        const sub = await response.json();
        console.log(sub);
        const filteredSubject = sub.subjects.filter(subject =>
          (lang === subject.subject)
        );
        const subId = filteredSubject[0].docRef.replace("notes/", "");
        if (subId !== null) {
          try {
            const response = await fetch(`https://us-central1-flutter-chedo.cloudfunctions.net/chedoImsApi/getSections/${subId}`);
            const sub = await response.json();
            setSyllabusContent(sub.sections.sort((a, b) => a.data.name.localeCompare(b.data.name)));
          } catch (error) {
            console.error('Error fetching subjects:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };
    fetchData();
  }, [lang]);

  return (
    <div className='container'>
      <div className='row mt-2'>
        <div className='col p-2 m-3'>
          <h3><b>Syllabus List</b></h3>
        </div>
        {syllabusContent && <>
        {syllabusContent.map(content => (
          <ul>
            <li
              className="text-left"
              id={content.id}
              style={{ padding: 0 }}
            >
              {content.data.name}
            </li>
          </ul>
        ))}
      </>}
      {!syllabusContent && <>
      <p>No Syllabus Content Available</p>
      </>}
      </div>
    </div>
  )
}
