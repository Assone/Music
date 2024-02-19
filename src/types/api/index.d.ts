import './album';
import './artist';
import './common';
import './mv';
import './playlist';
import './recommend';
import './search';
import './song';
import './top';
import './user';

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

    namespace Search {
      export * from './search';
    }

    namespace Common {
      export * from './common';
    }

    namespace User {
      export * from './user';
    }

    namespace Top {
      export * from './top';
    }

    namespace Mv {
      export * from './mv';
    }

    namespace RequestArgs {
      interface PaginationOptions {
        limit?: number;
        offset?: number;
      }
    }
  }
}

export {};
