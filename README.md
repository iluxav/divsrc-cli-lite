# Divsrc CLI Lite

## Emulator

```
divsrc-cli --emulate ./dist --port 5555"
```


## Push Artifact

### Get Artifact Information

```
divsrc-cli info --version 1.x.x --artifact_id @artifact-id --secret skSecretKey
```

### Push 

```
divsrc-cli push --version 1.x.x --file index.min.js --artifact_id @artifact-id --url https://cdn.my-domain.com/artifacts/1.x.x --secret skSecretKey
```

## Install

```
divsrc-cli install --version 1.x.x --file index.min.js --artifact_id @artifact-id --url https://cdn.my-domain.com/artifacts/1.x.x --secret skSecretKey
```