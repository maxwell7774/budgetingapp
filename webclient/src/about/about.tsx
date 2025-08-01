import { useEffect, useState } from "react";

async function fetchTest(): Promise<string> {
  const res = await fetch("/api/v1/auth/refresh");
  const dat = await res.json();
  return dat.token;
}

function About() {
  const [test, setTest] = useState<string>();

  useEffect(() => {
    fetchTest()
      .then((dat) => setTest(dat));
  }, []);

  return <div>{JSON.stringify(test)}</div>;
}

export default About;
