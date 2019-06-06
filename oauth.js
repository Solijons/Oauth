componentDidMount () {
    const refreshToken = () => {
      const data = new FormData();
      data.append('client_id', 'CLIENT_ID');
      data.append('client_secret', 'CLIENT_TOKEN');
      data.append('grant_type', 'client_credentials');

      fetch(API_URL, {
        body: new URLSearchParams(data),
        crossDomain: true,
        method: 'POST',
      })
      .then(res => res.json())
      .then(body => {
        console.log('body', body);
        //puts into Storage
        sessionStorage.setItem('oauth-token', body.access_token);
        sessionStorage.setItem('oauth-exp', Date.now() + (body.expires_in * 1000));
        return body.access_token;
      })
      .catch(err => {
        console.log('refresh token failure', err);
      });
    };

    const getToken = async () => {
      const exp = sessionStorage.getItem('oauth-exp') || 0;
      let token;
  
      if (exp > Date.now()) {
          token = sessionStorage.getItem('oauth-token');
      }
      else {
          token = await refreshToken();
      }
  
      console.log('returning token', token);
      return token;
    };

    getToken()
    .then(token => {
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Bearer' + ' ' + token ,
        },
        body: JSON.stringify({
          "query":"{getUserById(id: \"userName\") {id preferredName {first last }}}"
        })
      })
      .then(data => {
        return data.json()  
      })
      .then (returnData => { returnData })
        })
      })
    })
  }
