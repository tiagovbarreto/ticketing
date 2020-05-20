import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSucess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const res = await axios[method](url, body);

      if (onSucess) {
        onSucess(res.data);
      }

      return res.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4> Ops...</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
