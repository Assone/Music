import './album';
import './artist';
import './playlist';
import './recommend';
import './song';

declare global {
  namespace API {
    namespace Recommend {
      export * from './recommend';
    }

    namespace Album {
      export * from './album';
    }

    namespace Playlist {
      export * from './playlist';
    }

    namespace Song {
      export * from './song';
    }

    namespace Artist {
      export * from './artist';
    }

    namespace Common {
      interface PaginationOptions {
        limit?: number;
        offset?: number;
      }
    }
  }
}

export {};
