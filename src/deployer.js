const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');


const domain = process.env.DIVSRC_DOMAIN || 'https://api.divsrc.io';

function generateSessionId() {
  return [...Array(48)].map((i) => (~~(Math.random() * 36)).toString(36)).join('');
}

function getSecret(options) {
  return options.secret || process.env.DIVSRC_SECRET
}


function deployArtifact(artifactInfo, files, session, _secret) {
  const form = new FormData();
  form.append('artifact_id', artifactInfo.artifact_id);
  form.append('version', artifactInfo.version);
  form.append('name', artifactInfo.name);
  form.append('base_url', artifactInfo.base_url);
  form.append('file_name', artifactInfo.file_name);
  artifactInfo.description && form.append('description', artifactInfo.description);
  artifactInfo.importmap && form.append('importmap', JSON.stringify(artifactInfo.importmap));
  if (files) {
    form.append('files', JSON.stringify(files));
    files.forEach((file) => {
      const stream = fs.createReadStream(file.filePath);
      form.append(file.path, stream);
    });
  }
  if (process.env.DEBUG) {
    console.log('DEBUG: deployArtifact() session', session);
    console.log('DEBUG: deployArtifact() artifactInfo', artifactInfo);
    console.log('DEBUG: deployArtifact() files', files);
    return Promise.resolve();
  }

  return axios.post(`${domain}/v1/artifact/deploy`, form, {
    headers: Object.assign(form.getHeaders(), {
      'sdk-key': _secret,
      'session-id': session,
    }),
  }).then((res) => res && res.data).catch((e) => console.log('ERROR', e.message));
}

function getInstallations(pub_key) {
  return axios({
    method: 'post',
    url: `${domain}/v1/installation/${pub_key}`
  }).then((res) => (res ? res.data : [])).catch((e) => console.log('ERROR', e.message));
}

function install(artifact_id, zone, version, base_url, secret) {
  return axios({
    method: 'post',
    url: `${domain}/v1/installation/cli/${artifact_id}`,
    data: {zone, version, base_url},
    headers: {
      'sdk-key': secret
    },
  }).then((res) => (res ? res.data : [])).catch((e) => console.log('ERROR', e.message));
}


function getDeploymentInfo(params, session, _secret) {
  return axios({
    method: 'post',
    url: `${domain}/v1/artifact/deploy/info`,
    data: params,
    headers: {
      'sdk-key': _secret,
      'session-id': session,
    },
  }).then((res) => (res ? res.data : [])).catch((e) => console.log('ERROR', e.message));
}

module.exports = {
  install: function ({version, artifact_id, secret, url}) {
    const _secret = getSecret({secret})
    if (version && artifact_id && _secret && url) {
      install(artifact_id, artifact_id, version, url, _secret).then(res => {
        if (res) {
          console.log(JSON.stringify(res, null, 2))
        }
      })
    }
  },
  map: function ({public}) {
    if (public) {
      getInstallations(public).then(res => {
        if (res) {
          console.log(JSON.stringify(res, null, 2))
        }
      })
    } else {
      console.log('Please provide --public')
    }
  },
  push: function ({version, artifact_id, secret, url, mainFileName}) {
    const _secret = getSecret({secret});
    if (version && artifact_id && _secret && url && mainFileName) {
      deployArtifact({
        version,
        artifact_id,
        file_name: mainFileName,
        name: artifact_id,
        base_url: url
      }, null, generateSessionId(), _secret).then(res => {
        if (res) {
          console.log(JSON.stringify(res, null, 2))
        }
      })
    }
  },
  info: function ({version, artifact_id, secret}) {
    const _secret = getSecret({secret});
    if (version && artifact_id && _secret) {
      getDeploymentInfo([{version, artifact_id}], generateSessionId(), _secret).then(res => {
        if (res && res) {
          console.log(JSON.stringify(res[0], null, 2))
        }
      })
    } else {
      console.log('Please provide --artifact_id and --version')
    }
  }
};
