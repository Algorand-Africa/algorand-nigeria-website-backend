export interface IPFSJson {
  name: string;
  description: string;
  image: string;
  image_mimetype: string;
  external_url: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  properties: {
    file_url: string;
    file_url_mimetype: string;
    external_url: string;
    created_for: string;
    created_at: string;
    user_id: string;
  };
}

export interface IPFSUpload {
  name: string;
  description?: string;
  base64Image: string;
  externalUrl: string;
  traits: {
    name: string;
    value: string;
  }[];
  creatorName: string;
  creatorId: string;
}

export interface ImageData {
  imageKey: string;
  image: string;
}
